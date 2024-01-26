import { filter } from "../../core/helpers/filter";

describe(`when template does not contain any resource`, () => {
  const template = {
    Resources: {},
  };
  it(`should return an empty array`, () => {
    expect(filter(template)).toHaveLength(0);
  });
});
describe(`when template contains resources other that specified`, () => {
  const template = {
    Resources: {
      my_table: {
        Type: "AWS::DynamoDB::Table",
      },
    },
  };
  it(`should return an empty array`, () => {
    expect(filter(template)).toHaveLength(0);
  });
});
describe(`when template contains only an SQS Queue resource`, () => {
  const template = {
    Resources: {
      my_queue: {
        Type: "AWS::SQS::Queue",
      },
    },
  };
  it(`should return an empty array`, () => {
    expect(filter(template)).toHaveLength(0);
  });
});
describe(`when template contains only an SQS Queue and DynamoDB table resources`, () => {
  const template = {
    Resources: {
      my_queue: {
        Type: "AWS::SQS::Queue",
      },
      my_table: {
        Type: "AWS::DynamoDB::Table",
      },
    },
  };
  it(`should return an empty array`, () => {
    expect(filter(template)).toHaveLength(0);
  });
});
describe(`when template contains only an the required resources`, () => {
  describe("when there is no mapping", () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_function: {
          Type: "AWS::Lambda::Function",
        },
      },
    };
    it(`should return an empty array`, () => {
      expect(filter(template)).toHaveLength(0);
    });
  });
  describe("when the mapping does not have properties", () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_function: {
          Type: "AWS::Lambda::Function",
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
        },
      },
    };
    it(`should return an empty array`, () => {
      expect(filter(template)).toHaveLength(0);
    });
  });
  describe(`when the mapping has "Properties" as an empty object`, () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_function: {
          Type: "AWS::Lambda::Function",
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
          Properties: {},
        },
      },
    };
    it(`should return an empty array`, () => {
      expect(filter(template)).toHaveLength(0);
    });
  });
  describe(`when the mapping "Properties.EventSourceArn" does not have "EventSourceArn"`, () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_function: {
          Type: "AWS::Lambda::Function",
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
          Properties: {
            foo: "bar",
            baz: {
              kaz: 123,
            },
          },
        },
      },
    };
    it(`should return an empty array`, () => {
      expect(filter(template)).toHaveLength(0);
    });
  });
  describe(`when the mapping "Properties.EventSourceArn" is a number`, () => {
    const template = {
      Resources: {
        my_queue: {
          Type: "AWS::SQS::Queue",
        },
        my_function: {
          Type: "AWS::Lambda::Function",
        },
        my_mapping: {
          Type: "AWS::Lambda::EventSourceMapping",
          Properties: {
            EventSourceArn: 123,
            foo: "bar",
            baz: {
              kaz: 123,
            },
          },
        },
      },
    };
    it(`should return an empty array`, () => {
      expect(filter(template)).toHaveLength(0);
    });
  });
  describe(`when the mapping "Properties.EventSourceArn" is valid`, () => {
    describe(`when the mapping "Properties.FunctionName" a number`, () => {
      const template = {
        Resources: {
          my_queue: {
            Type: "AWS::SQS::Queue",
          },
          my_function: {
            Type: "AWS::Lambda::Function",
          },
          my_mapping: {
            Type: "AWS::Lambda::EventSourceMapping",
            Properties: {
              EventSourceArn: { "Fn::GetAtt": ["x", "Arn"] },
              FunctionName: 123,
              foo: "bar",
              baz: {
                kaz: 123,
              },
            },
          },
        },
      };
      it(`should return an empty array`, () => {
        expect(filter(template)).toHaveLength(0);
      });
    });
    describe(`when the mapping "Properties.FunctionName" is valid`, () => {
      const template = {
        Resources: {
          my_queue: {
            Type: "AWS::SQS::Queue",
          },
          my_function: {
            Type: "AWS::Lambda::Function",
          },
          my_mapping: {
            Type: "AWS::Lambda::EventSourceMapping",
            Properties: {
              EventSourceArn: { "Fn::GetAtt": ["x", "Arn"] },
              FunctionName: { "Fn::GetAtt": ["y", "Arn"] },
              foo: "bar",
              baz: {
                kaz: 123,
              },
            },
          },
        },
      };
      it(`should return an empty array`, () => {
        expect(filter(template)).toHaveLength(0);
      });
    });
    describe(`when the mapping "Properties.EventSourceArn" and "Properties.FunctionName" is correct`, () => {
      describe(`when the mapping "Properties.EventSourceArn" and "Properties.FunctionName" are Fn GetAtt intrensic functions`, () => {
        const template = {
          Resources: {
            my_queue: {
              Type: "AWS::SQS::Queue",
            },
            my_function: {
              Type: "AWS::Lambda::Function",
            },
            my_mapping: {
              Type: "AWS::Lambda::EventSourceMapping",
              Properties: {
                EventSourceArn: { "Fn::GetAtt": ["my_queue", "Arn"] },
                FunctionName: { "Fn::GetAtt": ["my_function", "Arn"] },
                foo: "bar",
                baz: {
                  kaz: 123,
                },
              },
            },
          },
        };
        it(`should return an array having length 1`, () => {
          expect(filter(template)).toHaveLength(1);
        });
        it(`should return a correct array`, () => {
          expect(filter(template)).toEqual(
            expect.arrayContaining([
              {
                integration: {
                  LogicalId: "my_mapping",
                  Properties: {
                    EventSourceArn: { "Fn::GetAtt": ["my_queue", "Arn"] },
                    FunctionName: { "Fn::GetAtt": ["my_function", "Arn"] },
                    baz: { kaz: 123 },
                    foo: "bar",
                  },
                },
                lambda: { LogicalId: "my_function", Properties: undefined },
                sqs: { LogicalId: "my_queue", Properties: undefined },
              },
            ]),
          );
        });
      });
      describe(`when the mapping "Properties.EventSourceArn" is a Ref and "Properties.FunctionName" is an Fn GetAtt intrensic functions`, () => {
        const template = {
          Resources: {
            my_queue: {
              Type: "AWS::SQS::Queue",
            },
            my_function: {
              Type: "AWS::Lambda::Function",
            },
            my_mapping: {
              Type: "AWS::Lambda::EventSourceMapping",
              Properties: {
                EventSourceArn: { Ref: "my_queue" },
                FunctionName: { "Fn::GetAtt": ["my_function", "Arn"] },
                foo: "bar",
                baz: {
                  kaz: 123,
                },
              },
            },
          },
        };
        it(`should return an array having length 1`, () => {
          expect(filter(template)).toHaveLength(1);
        });
        it(`should return a correct array`, () => {
          expect(filter(template)).toEqual(
            expect.arrayContaining([
              {
                integration: {
                  LogicalId: "my_mapping",
                  Properties: {
                    EventSourceArn: { Ref: "my_queue" },
                    FunctionName: { "Fn::GetAtt": ["my_function", "Arn"] },
                    baz: { kaz: 123 },
                    foo: "bar",
                  },
                },
                lambda: { LogicalId: "my_function", Properties: undefined },
                sqs: { LogicalId: "my_queue", Properties: undefined },
              },
            ]),
          );
        });
      });
      describe(`when the mapping "Properties.EventSourceArn" is an Fn GetAtt and "Properties.FunctionName" is a Ref intrensic functions`, () => {
        const template = {
          Resources: {
            my_queue: {
              Type: "AWS::SQS::Queue",
            },
            my_function: {
              Type: "AWS::Lambda::Function",
            },
            my_mapping: {
              Type: "AWS::Lambda::EventSourceMapping",
              Properties: {
                EventSourceArn: { "Fn::GetAtt": ["my_queue", "Arn"] },
                FunctionName: { Ref: "my_function" },
                foo: "bar",
                baz: {
                  kaz: 123,
                },
              },
            },
          },
        };
        it(`should return an array having length 1`, () => {
          expect(filter(template)).toHaveLength(1);
        });
        it(`should return a correct array`, () => {
          expect(filter(template)).toEqual(
            expect.arrayContaining([
              {
                integration: {
                  LogicalId: "my_mapping",
                  Properties: {
                    EventSourceArn: { "Fn::GetAtt": ["my_queue", "Arn"] },
                    FunctionName: { Ref: "my_function" },
                    baz: { kaz: 123 },
                    foo: "bar",
                  },
                },
                lambda: { LogicalId: "my_function", Properties: undefined },
                sqs: { LogicalId: "my_queue", Properties: undefined },
              },
            ]),
          );
        });
      });
      describe(`when the mapping "Properties.EventSourceArn" and "Properties.FunctionName" are Ref intrensic functions`, () => {
        const template = {
          Resources: {
            my_queue: {
              Type: "AWS::SQS::Queue",
            },
            my_function: {
              Type: "AWS::Lambda::Function",
            },
            my_mapping: {
              Type: "AWS::Lambda::EventSourceMapping",
              Properties: {
                EventSourceArn: { Ref: "my_queue" },
                FunctionName: { Ref: "my_function" },
                foo: "bar",
                baz: {
                  kaz: 123,
                },
              },
            },
          },
        };
        it(`should return an array having length 1`, () => {
          expect(filter(template)).toHaveLength(1);
        });
        it(`should return a correct array`, () => {
          expect(filter(template)).toEqual(
            expect.arrayContaining([
              {
                integration: {
                  LogicalId: "my_mapping",
                  Properties: {
                    EventSourceArn: { Ref: "my_queue" },
                    FunctionName: { Ref: "my_function" },
                    baz: { kaz: 123 },
                    foo: "bar",
                  },
                },
                lambda: { LogicalId: "my_function", Properties: undefined },
                sqs: { LogicalId: "my_queue", Properties: undefined },
              },
            ]),
          );
        });
      });
      describe(`when SQS Queue and Lambda Function have properties`, () => {
        const template = {
          Resources: {
            my_queue: {
              Type: "AWS::SQS::Queue",
              Properties: {
                p1: {
                  p2: "abc",
                },
              },
            },
            my_function: {
              Type: "AWS::Lambda::Function",
              Properties: {
                p3: {
                  p4: "def",
                },
              },
            },
            my_mapping: {
              Type: "AWS::Lambda::EventSourceMapping",
              Properties: {
                EventSourceArn: { Ref: "my_queue" },
                FunctionName: { Ref: "my_function" },
                foo: "bar",
                baz: {
                  kaz: 123,
                },
              },
            },
          },
        };
        it(`should return an array having length 1`, () => {
          expect(filter(template)).toHaveLength(1);
        });
        it(`should return a correct array`, () => {
          expect(filter(template)).toEqual(
            expect.arrayContaining([
              {
                integration: {
                  LogicalId: "my_mapping",
                  Properties: {
                    EventSourceArn: { Ref: "my_queue" },
                    FunctionName: { Ref: "my_function" },
                    baz: { kaz: 123 },
                    foo: "bar",
                  },
                },
                lambda: {
                  LogicalId: "my_function",
                  Properties: {
                    p3: {
                      p4: "def",
                    },
                  },
                },
                sqs: {
                  LogicalId: "my_queue",
                  Properties: {
                    p1: {
                      p2: "abc",
                    },
                  },
                },
              },
            ]),
          );
        });
      });
      describe(`when having multiple mappings`, () => {
        describe("when one only one mapping is correct", () => {
          const template = {
            Resources: {
              my_queue_1: {
                Type: "AWS::SQS::Queue",
              },
              my_function_1: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_1: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_1" },
                  FunctionName: { Ref: "my_function_1" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
              my_topic_2: {
                Type: "AWS::SNS::Topic",
              },
              my_function_2: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_2: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_topic_2" },
                  FunctionName: { Ref: "my_function_2" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
            },
          };
          it(`should return an array having length 1`, () => {
            expect(filter(template)).toHaveLength(1);
          });
          it(`should return a correct array`, () => {
            expect(filter(template)).toEqual(
              expect.arrayContaining([
                {
                  integration: {
                    LogicalId: "my_mapping_1",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_1" },
                      FunctionName: { Ref: "my_function_1" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_1", Properties: undefined },
                  sqs: { LogicalId: "my_queue_1", Properties: undefined },
                },
              ]),
            );
          });
        });
        describe("when two mappings are correct", () => {
          const template = {
            Resources: {
              my_queue_1: {
                Type: "AWS::SQS::Queue",
              },
              my_function_1: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_1: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_1" },
                  FunctionName: { Ref: "my_function_1" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
              my_queue_2: {
                Type: "AWS::SQS::Queue",
              },
              my_function_2: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_2: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_2" },
                  FunctionName: { Ref: "my_function_2" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
            },
          };
          it(`should return an array having length 2`, () => {
            expect(filter(template)).toHaveLength(2);
          });
          it(`should return an array having length 2`, () => {
            expect(filter(template)).toEqual(
              expect.arrayContaining([
                {
                  integration: {
                    LogicalId: "my_mapping_1",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_1" },
                      FunctionName: { Ref: "my_function_1" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_1", Properties: undefined },
                  sqs: { LogicalId: "my_queue_1", Properties: undefined },
                },
                {
                  integration: {
                    LogicalId: "my_mapping_2",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_2" },
                      FunctionName: { Ref: "my_function_2" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_2", Properties: undefined },
                  sqs: { LogicalId: "my_queue_2", Properties: undefined },
                },
              ]),
            );
          });
        });
        describe("when two mappings are pointing to the same SQS Queue", () => {
          const template = {
            Resources: {
              my_queue_1: {
                Type: "AWS::SQS::Queue",
              },
              my_function_1: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_1: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_1" },
                  FunctionName: { Ref: "my_function_1" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
              my_queue_2: {
                Type: "AWS::SQS::Queue",
              },
              my_function_2: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_2: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_1" },
                  FunctionName: { Ref: "my_function_2" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
            },
          };
          it(`should return an array having length 2`, () => {
            expect(filter(template)).toHaveLength(2);
          });
          it(`should return a correct array`, () => {
            expect(filter(template)).toEqual(
              expect.arrayContaining([
                {
                  integration: {
                    LogicalId: "my_mapping_1",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_1" },
                      FunctionName: { Ref: "my_function_1" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_1", Properties: undefined },
                  sqs: { LogicalId: "my_queue_1", Properties: undefined },
                },
                {
                  integration: {
                    LogicalId: "my_mapping_2",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_1" },
                      FunctionName: { Ref: "my_function_2" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_2", Properties: undefined },
                  sqs: { LogicalId: "my_queue_1", Properties: undefined },
                },
              ]),
            );
          });
        });
        describe("when two mappings are pointing to the same Lambda Function", () => {
          const template = {
            Resources: {
              my_queue_1: {
                Type: "AWS::SQS::Queue",
              },
              my_function_1: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_1: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_1" },
                  FunctionName: { Ref: "my_function_1" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
              my_queue_2: {
                Type: "AWS::SQS::Queue",
              },
              my_function_2: {
                Type: "AWS::Lambda::Function",
              },
              my_mapping_2: {
                Type: "AWS::Lambda::EventSourceMapping",
                Properties: {
                  EventSourceArn: { Ref: "my_queue_2" },
                  FunctionName: { Ref: "my_function_1" },
                  foo: "bar",
                  baz: {
                    kaz: 123,
                  },
                },
              },
            },
          };
          it(`should return an array having length 2`, () => {
            expect(filter(template)).toHaveLength(2);
          });
          it(`should return a correct array`, () => {
            expect(filter(template)).toEqual(
              expect.arrayContaining([
                {
                  integration: {
                    LogicalId: "my_mapping_1",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_1" },
                      FunctionName: { Ref: "my_function_1" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_1", Properties: undefined },
                  sqs: { LogicalId: "my_queue_1", Properties: undefined },
                },
                {
                  integration: {
                    LogicalId: "my_mapping_2",
                    Properties: {
                      EventSourceArn: { Ref: "my_queue_2" },
                      FunctionName: { Ref: "my_function_1" },
                      baz: { kaz: 123 },
                      foo: "bar",
                    },
                  },
                  lambda: { LogicalId: "my_function_1", Properties: undefined },
                  sqs: { LogicalId: "my_queue_2", Properties: undefined },
                },
              ]),
            );
          });
        });
      });
    });
  });
});
